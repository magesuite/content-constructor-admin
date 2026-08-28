<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component\Product;

class Chooser extends \Magento\Backend\Block\Widget\Grid\Extended
{
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Backend\Helper\Data $backendHelper,
        protected \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory $productCollectionFactory,
        protected \Magento\Catalog\Model\Product\Type $productType,
        protected \Magento\Catalog\Model\Product\Visibility $productVisibility,
        protected \Magento\Catalog\Model\Product\Attribute\Source\Status $productStatus,
        protected \Magento\Store\Model\ResourceModel\Website\CollectionFactory $websiteCollectionFactory,
        array $data = []
    ) {
        parent::__construct($context, $backendHelper, $data);
    }

    protected function _construct() // phpcs:ignore
    {
        parent::_construct();
        $this->setDefaultSort('chooser_entity_id');
        $this->setUseAjax(true);
    }

    public function getGridUrl(): string
    {
        return $this->getUrl('contentconstructor/component/productChooser', [
            'products_grid' => true,
            '_current' => true,
            'uniq_id' => $this->getId(),
        ]);
    }

    public function getRowClickCallback(): string
    {
        return 'function (grid, event) {
            var trElement = Event.findElement(event, "tr");
            var skuCell = trElement.down(".col-sku");
            var sku = skuCell ? (skuCell.textContent || "").replace(/^\s+|\s+$/g, "") : "";

            if (sku && typeof window.csProductChooserCallback === "function") {
                window.csProductChooserCallback(sku);
            }
        }';
    }

    protected function _prepareCollection() // phpcs:ignore
    {
        $collection = $this->productCollectionFactory->create()
            ->setStoreId(0)
            ->addAttributeToSelect('name')
            ->addAttributeToSelect('sku');

        $collection->joinAttribute('status', 'catalog_product/status', 'entity_id', null, 'inner');
        $collection->joinAttribute('visibility', 'catalog_product/visibility', 'entity_id', null, 'inner');

        $this->setCollection($collection);

        $this->getCollection()->addWebsiteNamesToResult();

        return parent::_prepareCollection();
    }

    protected function _addColumnFilterToCollection($column) // phpcs:ignore
    {
        if ($this->getCollection() && $column->getId() === 'websites') {
            $this->getCollection()->joinField(
                'websites',
                'catalog_product_website',
                'website_id',
                'product_id=entity_id',
                null,
                'left'
            );
        }

        return parent::_addColumnFilterToCollection($column);
    }

    protected function _prepareColumns() // phpcs:ignore
    {
        $this->addColumn(
            'chooser_entity_id',
            [
                'header' => __('ID'),
                'index' => 'entity_id',
                'sortable' => true,
                'header_css_class' => 'col-id',
                'column_css_class' => 'col-id',
            ]
        );

        $this->addColumn(
            'chooser_sku',
            [
                'header' => __('SKU'),
                'index' => 'sku',
                'header_css_class' => 'col-sku',
                'column_css_class' => 'col-sku',
            ]
        );

        $this->addColumn(
            'chooser_name',
            [
                'header' => __('Name'),
                'index' => 'name',
                'header_css_class' => 'col-product',
                'column_css_class' => 'col-product',
            ]
        );

        $this->addColumn(
            'chooser_type',
            [
                'header' => __('Type'),
                'index' => 'type_id',
                'type' => 'options',
                'options' => $this->productType->getOptionArray(),
                'header_css_class' => 'col-type',
                'column_css_class' => 'col-type',
            ]
        );

        $this->addColumn(
            'chooser_visibility',
            [
                'header' => __('Visibility'),
                'index' => 'visibility',
                'type' => 'options',
                'options' => $this->productVisibility->getOptionArray(),
                'header_css_class' => 'col-visibility',
                'column_css_class' => 'col-visibility',
            ]
        );

        $this->addColumn(
            'chooser_status',
            [
                'header' => __('Status'),
                'index' => 'status',
                'type' => 'options',
                'options' => $this->productStatus->getOptionArray(),
                'header_css_class' => 'col-status',
                'column_css_class' => 'col-status',
            ]
        );

        $this->addColumn(
            'websites',
            [
                'header' => __('Websites'),
                'index' => 'websites',
                'type' => 'options',
                'sortable' => false,
                'options' => $this->websiteCollectionFactory->create()->toOptionHash(),
                'header_css_class' => 'col-websites',
                'column_css_class' => 'col-websites',
            ]
        );

        return parent::_prepareColumns();
    }
}
