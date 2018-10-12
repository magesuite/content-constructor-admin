<?php

namespace MageSuite\ContentConstructorAdmin\Observers;

use Magento\Cms\Model\Page;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Event\ObserverInterface;

class PageEditObserver implements ObserverInterface
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
        /** @var Page $page */
        $page = $observer->getData('page');

        $data = $request->getPostValue();

        if(isset($data['components']) AND !empty($data['components'])) {
            $components = json_decode($data['components'], true);

            $layoutUpdateXml = $this->configurationToXmlMapper->map($components, $page->getLayoutUpdateXml());

            $page->setLayoutUpdateXml($layoutUpdateXml);
            $page->setContent('');
        }

        $this->clearLayoutCache();
    }

    private function clearLayoutCache()
    {
        $this->cacheTypeList->cleanType('layout');
    }
}