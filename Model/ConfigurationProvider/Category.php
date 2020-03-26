<?php

namespace MageSuite\ContentConstructorAdmin\Model\ConfigurationProvider;

class Category implements \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\ConfigurationProvider
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
        /** @var \Magento\Catalog\Model\Category $category */
        $category = $this->registry->registry('current_category');

        $configuration = json_encode([]);

        if ($category !== null and !empty($category->getContentConstructorContent())) {
            $configuration = $category->getContentConstructorContent();
        }

        if (empty($configuration)) {
            $configuration = json_encode([self::CATEGORY_GRID_COMPONENT_DEFAULT_CONFIGURATION]);
        }

        return $configuration;
    }

    public function getPageType()
    {
        return 'category_form.category_form';
    }
}
