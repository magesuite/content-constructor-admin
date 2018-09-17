<?php

namespace MageSuite\ContentConstructorAdmin\Observers;

use Magento\Framework\App\RequestInterface;
use Magento\Framework\Event\ObserverInterface;

class CategoryEditObserver implements ObserverInterface
{
    /**
     * @var \Magento\Framework\App\Cache\TypeListInterface
     */
    private $cacheTypeList;

    /**
     * @var \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper
     */
    private $configurationToXmlMapper;

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
        /** @var RequestInterface $request */
        $request = $observer->getData('request');
        /** @var \Magento\Catalog\Model\Category $page */
        $category = $observer->getData('category');

        $data = $request->getPostValue();

        if(isset($data['components']) AND !empty($data['components'])) {
            $components = json_decode($data['components'], true);

            $layoutUpdateXml = $this->configurationToXmlMapper->map($components, $category->getCustomLayoutUpdate());

            $category->setCustomLayoutUpdate($layoutUpdateXml);
        }

        $this->clearLayoutCache();
    }

    private function clearLayoutCache()
    {
        $this->cacheTypeList->cleanType('layout');
    }
}