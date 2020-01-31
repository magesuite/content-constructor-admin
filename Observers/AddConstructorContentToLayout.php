<?php

namespace MageSuite\ContentConstructorAdmin\Observers;

class AddConstructorContentToLayout implements \Magento\Framework\Event\ObserverInterface
{
    /**
     * @var \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper
     */
    protected $configurationToXmlMapper;

    public function __construct(\MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper $configurationToXmlMapper)
    {
        $this->configurationToXmlMapper = $configurationToXmlMapper;
    }

    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        /** @var \Magento\Cms\Model\Page $page */
        $page = $observer->getData()["page"];
        $updateContentJson = $page->getContentConstructorContent() ?: "[]";
        $updateContentXml = $this->configurationToXmlMapper->map(json_decode($updateContentJson, true), $page->getLayoutUpdateXml());

        $page->setLayoutUpdateXml($updateContentXml);
    }
}
