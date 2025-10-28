<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Observers;

class BrandEditObserver implements \Magento\Framework\Event\ObserverInterface
{
    public function __construct(protected \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper $configurationToXmlMapper) {}

    public function execute(\Magento\Framework\Event\Observer $observer): void
    {
        $version = \Composer\InstalledVersions::getVersion('creativestyle/magesuite-brand-management');

        if (!empty($version) && version_compare($version, '2.0.0') >= 0) {
            return;
        }

        $params = $observer->getData('params');

        /** @var \MageSuite\BrandManagement\Model\Brands $brand */
        $brand = $observer->getData('brand');

        if (empty($params['use_default_components']) && !empty($params['components'])) {
            $brand->setContentConstructorContent($params['components']);
        }
    }
}
