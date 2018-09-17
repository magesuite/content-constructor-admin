<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor;

class Category extends AbstractConstructor
{
    const CATEGORY_GRID_COMPONENT_DEFAULT_CONFIGURATION = [
        "id" => "componentproductgrid",
        "type" => "magento-product-grid-teasers",
        "section" => "grid",
        "data" => []
    ];

    public function getExistingComponentsConfiguration()
    {
        /** @var \Magento\Catalog\Model\Category $category */
        $category = $this->registry->registry('current_category');

        $configuration = [];

        if ($category !== null) {
            $configuration = $this->xmlToComponentConfiguration->map($category->getCustomLayoutUpdate());
        }

        if (empty($configuration)) {
            $configuration = [self::CATEGORY_GRID_COMPONENT_DEFAULT_CONFIGURATION];
        }

        return json_encode($configuration);
    }

    public function getPageType()
    {
        return 'category_form.category_form';
    }
}