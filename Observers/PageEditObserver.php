<?php

namespace MageSuite\ContentConstructorAdmin\Observers;

class PageEditObserver implements \Magento\Framework\Event\ObserverInterface
{
    /**
     * @var \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper
     */
    protected $xmlToComponentConfigurationMapper;

    /**
     * @var \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper
     */
    protected $configurationToXmlMapper;

    public function __construct(
        \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper $configurationToXmlMapper,
        \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper $xmlToComponentConfigurationMapper
    ) {
        $this->configurationToXmlMapper = $configurationToXmlMapper;
        $this->xmlToComponentConfigurationMapper = $xmlToComponentConfigurationMapper;
    }

    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        /** @var \Magento\Framework\App\RequestInterface $request */
        $request = $observer->getData('request');
        /** @var \Magento\Cms\Model\Page $page */
        $page = $observer->getData('page');

        $data = $request->getPostValue();

        if (isset($data['components']) && !empty($data['components'])) {
            $components = json_decode($data['components'], true);
            $existingComponents = $page->getContentConstructorContent();

            $page->setContent('');

            if (!empty($components) || !empty($existingComponents)) {
                $page->setContentConstructorContent(json_encode($components));
            }
        }
    }
}
