<?php

namespace MageSuite\ContentConstructorAdmin\Service\Upgrade;

class Migration
{
    /**
     * @var \Magento\Framework\App\State
     */
    protected $state;

    /**
     * @var \Magento\Store\Model\StoreManager
     */
    protected $storeManager;

    /**
     * @var \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper
     */
    protected $xmlToComponentConfigurationMapper;

    /**
     * @var mixed
     */
    protected $collectionsToMigrate;

    public function __construct(
        \Magento\Framework\App\State $state,
        \Magento\Store\Model\StoreManager $storeManager,
        \Magento\Cms\Model\ResourceModel\Page\Collection $pageCollection,
        \Magento\Catalog\Model\ResourceModel\Product\Collection $productCollection,
        \Magento\Catalog\Model\ResourceModel\Category\Collection $categoryCollection,
        \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper $xmlToComponentConfigurationMapper
    ) {
        $this->state = $state;
        $this->storeManager = $storeManager;
        $this->xmlToComponentConfigurationMapper = $xmlToComponentConfigurationMapper;

        $this->collectionsToMigrate = [
            $pageCollection,
            $productCollection,
            $categoryCollection
        ];
    }

    public function transferOldXmlValuesToNewJsonFields()
    {
        $stores = $this->storeManager->getStores();

        foreach ($this->collectionsToMigrate as $collection) {
            $portionNumber = 0;
            while ($items = $this->getItemsPortion($collection, ++$portionNumber)) {
                if ($collection instanceof \Magento\Cms\Model\ResourceModel\Page\Collection) {
                    $this->transferXmlContentToJson($items);
                    continue;
                }

                $this->transferXmlContentToJsonForAllStores($items, $stores);
            }
        }
    }

    protected function getItemsPortion(
        $collection,
        int $currentPage,
        int $pageSize = 1000
    ) {
        //Check whether the next page will contain new items
        if ($currentPage > ceil($collection->getSize() / $pageSize)) {
            return [];
        }

        return $collection->setPageSize($pageSize)->setCurPage($currentPage)->getItems();
    }

    protected function transferXmlContentToJson($items)
    {
        foreach ($items as $item) {
            if (empty($item->getLayoutUpdateXml())) {
                continue;
            }

            $configuration = $this->xmlToComponentConfigurationMapper->map($item->getLayoutUpdateXml());
            $item->setContentConstructorContent(json_encode($configuration));
            $item->save();
        }
    }

    protected function transferXmlContentToJsonForAllStores($items, $stores)
    {
        foreach ($stores as $store) {
            foreach ($items as $item) {
                $item->setStore($store->getId());
            }

            $this->transferXmlContentToJson($items);
        }
    }
}
