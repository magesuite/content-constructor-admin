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
        $this->state->setAreaCode(\Magento\Framework\App\Area::AREA_ADMINHTML);
        $storesIds = $this->getStoresIds();

        foreach ($this->collectionsToMigrate as $collection) {
            if ($collection instanceof \Magento\Cms\Model\ResourceModel\Page\Collection) {
                $collection->addFieldToFilter("layout_update_xml", ["notnull" => true]);
                $this->setJsonValueForItemsInCollation($collection);
                continue;
            }

            foreach ($storesIds as $storeId) {
                $this->storeManager->setCurrentStore($storeId);

                $collectionWithFilters = clone $collection;
                $collectionWithFilters->addAttributeToSelect('*')->setStoreId($storeId);
                $collectionWithFilters->addAttributeToFilter("custom_layout_update", ["notnull" => true]);

                $this->addWhereCustomLayoutUpdateIsNoNull($collectionWithFilters);
                $this->setJsonValueForItemsInCollation($collectionWithFilters);
            }
        }
    }

    protected function setJsonValueForItemsInCollation($collection)
    {
        $portionNumber = 0;
        while ($items = $this->getItemsPortion($collection, ++$portionNumber)) {
            $this->transferXmlContentToJson($items);
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
            $layoutUpdateXml = $this->getLayoutUpdateContent($item);
            $configuration = $this->xmlToComponentConfigurationMapper->map($layoutUpdateXml);
            $item->setContentConstructorContent(json_encode($configuration));
            $item->save();
        }
    }

    protected function getLayoutUpdateContent($item)
    {
        if ($item instanceof \Magento\Cms\Model\Page) {
            return $item->getLayoutUpdateXml();
        }

        return $item->getCustomLayoutUpdate();
    }

    protected function getStoresIds()
    {
        $result = [0];

        $stores = $this->storeManager->getStores();
        foreach ($stores as $store) {
            $result[] = $store->getId();
        }

        return $result;
    }

    protected function addWhereCustomLayoutUpdateIsNoNull(&$collection)
    {
        $expr = new \Zend_Db_Expr("at_custom_layout_update.value IS NOT NULL");
        $collection->getSelect()->reset(\Magento\Framework\DB\Select::WHERE)->where($expr);
    }
}
