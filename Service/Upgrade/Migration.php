<?php

namespace MageSuite\ContentConstructorAdmin\Service\Upgrade;

class Migration
{
    const COLLECTION_PAGE_SIZE = 1000;

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
        \Magento\Cms\Model\ResourceModel\Page\CollectionFactory $pageCollection,
        \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory $productCollection,
        \Magento\Catalog\Model\ResourceModel\Category\CollectionFactory $categoryCollection,
        \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper $xmlToComponentConfigurationMapper
    ) {
        $this->state = $state;
        $this->storeManager = $storeManager;
        $this->xmlToComponentConfigurationMapper = $xmlToComponentConfigurationMapper;

        $this->collectionsToMigrate = [
            $pageCollection->create([]),
            $productCollection->create([]),
            $categoryCollection->create([]),
        ];
    }

    public function transferOldXmlValuesToNewJsonFields()
    {
        $storesIds = $this->getStoresIds();

        foreach ($this->collectionsToMigrate as $collection) {
            if ($collection instanceof \Magento\Cms\Model\ResourceModel\Page\Collection) {
                $collection->addFieldToFilter("layout_update_xml", ["notnull" => true]);
                $this->setJsonValueForItemsInCollation($collection);
                continue;
            }

            $this->state->emulateAreaCode(\Magento\Framework\App\Area::AREA_ADMINHTML, function () use ($storesIds, $collection) {
                foreach ($storesIds as $storeId) {
                    $this->storeManager->setCurrentStore($storeId);

                    $collectionWithFilters = clone $collection;
                    $collectionWithFilters->setStoreId($storeId)->addAttributeToSelect('*');
                    $collectionWithFilters->addAttributeToFilter("custom_layout_update", ["notnull" => true], "left");

                    $this->doNotAllowDefaultValue($collectionWithFilters);
                    $this->setJsonValueForItemsInCollation($collectionWithFilters);
                }
            });
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
        int $currentPage
    ) {
        //Check whether the next page will contain new items
        if ($currentPage > ceil($collection->getSize() / self::COLLECTION_PAGE_SIZE)) {
            return [];
        }

        return $collection->setPageSize(self::COLLECTION_PAGE_SIZE)->setCurPage($currentPage)->getItems();
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

    protected function doNotAllowDefaultValue(&$collection)
    {
        $expr = new \Zend_Db_Expr("at_custom_layout_update.value IS NOT NULL");
        $collection->getSelect()->reset(\Magento\Framework\DB\Select::WHERE)->where($expr);
    }
}
