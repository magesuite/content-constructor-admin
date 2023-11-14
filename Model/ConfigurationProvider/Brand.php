<?php

namespace MageSuite\ContentConstructorAdmin\Model\ConfigurationProvider;

class Brand implements \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\ConfigurationProvider
{
    const CATEGORY_GRID_COMPONENT_DEFAULT_CONFIGURATION = [
        "id" => "componentproductgrid",
        "type" => "magento-product-grid-teasers",
        "section" => "grid",
        "data" => []
    ];

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
