<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Model\ConfigurationProvider;

class Brand implements \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\ConfigurationProvider
{
    public const CATEGORY_GRID_COMPONENT_DEFAULT_CONFIGURATION = [
        "id" => "componentproductgrid",
        "type" => "magento-product-grid-teasers",
        "section" => "grid",
        "data" => [],
    ];

    public function __construct(
        protected \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper $xmlToComponentConfiguration,
        protected \Magento\Framework\Registry $registry
    ) {}

    public function getExistingComponentsConfiguration(): string
    {
        $configuration = [];
        $brandContentConstructorContent = $this->getContentConstructorContent();

        if (!empty($brandContentConstructorContent)) {
            $configuration = json_decode($brandContentConstructorContent, true);
        }

        if (empty($configuration)) {
            $configuration = [self::CATEGORY_GRID_COMPONENT_DEFAULT_CONFIGURATION];
        }

        return json_encode($configuration);
    }

    public function getPageType(): string
    {
        return 'brands_edit_form.brands_edit_form';
    }

    public function getContentConstructorContent(): string
    {
        $version = \Composer\InstalledVersions::getVersion('creativestyle/magesuite-brand-management');

        if (!empty($version) && version_compare($version, '2.0.0') < 0) {
            /** @var \MageSuite\BrandManagement\Model\Brands $brand */
            $brand = $this->registry->registry('brand');

            return (string)$brand?->getContentConstructorContent();
        }

        $requestData = \Magento\Framework\App\ObjectManager::getInstance()->get(\MageSuite\BrandManagement\Ui\DataProvider\Brand\Form\RequestData::class);

        try {
            $brand = $requestData->getBrand();

            return (string)$brand?->getContentConstructorContent();
        } catch (\Magento\Framework\Exception\NoSuchEntityException) {
            return json_encode([]);
        }
    }
}
