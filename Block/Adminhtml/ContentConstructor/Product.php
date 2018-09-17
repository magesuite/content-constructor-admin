<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor;

class Product extends AbstractConstructor
{
    public function getExistingComponentsConfiguration()
    {
        /** @var \Magento\Catalog\Model\Product $category */
        $product = $this->registry->registry('current_product');

        $configuration = [];

        if ($product !== null) {
            $configuration = $this->xmlToComponentConfiguration->map($product->getCustomLayoutUpdate());
        }

        return json_encode($configuration);
    }

    public function getPageType()
    {
        return 'product_form.product_form';
    }
}