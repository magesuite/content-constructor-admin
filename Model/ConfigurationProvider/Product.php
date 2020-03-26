<?php

namespace MageSuite\ContentConstructorAdmin\Model\ConfigurationProvider;

class Product implements \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\ConfigurationProvider
{
    /**
     * @var \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper
     */
    protected $xmlToComponentConfiguration;

    /**
     * @var \Magento\Framework\Registry
     */
    protected $registry;

    public function __construct(
        \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper $xmlToComponentConfiguration,
        \Magento\Framework\Registry $registry
    )
    {
        $this->xmlToComponentConfiguration = $xmlToComponentConfiguration;
        $this->registry = $registry;
    }

    public function getExistingComponentsConfiguration()
    {
        /** @var \Magento\Catalog\Model\Product $category */
        $product = $this->registry->registry('current_product');

        $configuration = json_encode([]);

        if ($product !== null && !empty($product->getContentConstructorContent())) {
            $configuration = $product->getContentConstructorContent();
        }

        return $configuration;
    }

    public function getPageType()
    {
        return 'product_form.product_form';
    }
}
