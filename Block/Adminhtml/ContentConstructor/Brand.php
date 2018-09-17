<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor;

class Brand extends AbstractConstructor
{
    const CATEGORY_GRID_COMPONENT_DEFAULT_CONFIGURATION = [
        "id" => "componentproductgrid",
        "type" => "magento-product-grid-teasers",
        "section" => "grid",
        "data" => []
    ];

    public function getExistingComponentsConfiguration()
    {
        /** @var \MageSuite\BrandManagement\Model\Brands $brand */
        $brand = $this->registry->registry('brand');

        $configuration = [];

        if ($brand !== null) {
            $configuration = $this->xmlToComponentConfiguration->map($brand->getLayoutUpdateXml());
        }

        if (empty($configuration)) {
            $configuration = [self::CATEGORY_GRID_COMPONENT_DEFAULT_CONFIGURATION];
        }

        return json_encode($configuration);
    }

    public function getPageType()
    {
        return 'brands_edit_form.brands_edit_form';
    }
}