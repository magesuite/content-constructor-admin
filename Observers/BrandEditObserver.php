<?php

namespace MageSuite\ContentConstructorAdmin\Observers;

class BrandEditObserver implements \Magento\Framework\Event\ObserverInterface
{
    /**
     * @var \Magento\Framework\App\Cache\TypeListInterface
     */
    protected $cacheTypeList;

    /**
     * @var \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper
     */
    protected $configurationToXmlMapper;

    public function __construct(
        \Magento\Framework\App\Cache\TypeListInterface $cacheTypeList,
        \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper $configurationToXmlMapper
    )
    {
        $this->cacheTypeList = $cacheTypeList;
        $this->configurationToXmlMapper = $configurationToXmlMapper;
    }

    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        $params = $observer->getData('params');

        /** @var \MageSuite\BrandManagement\Model\Brands $brand */
        $brand = $observer->getData('brand');

        if(isset($params['components']) AND !empty($params['components'])) {
            $components = json_decode($params['components'], true);

            $layoutUpdateXml = $this->configurationToXmlMapper->map($components, $brand->getLayoutUpdateXml());

            $brand->setLayoutUpdateXml($layoutUpdateXml);
        }

        $this->clearLayoutCache();
    }

    private function clearLayoutCache()
    {
        $this->cacheTypeList->cleanType('layout');
    }
}
