<?php

namespace MageSuite\ContentConstructorAdmin\Observers;

class CategoryEditObserver implements \Magento\Framework\Event\ObserverInterface
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
        /** @var \Magento\Framework\App\RequestInterface $request */
        $request = $observer->getData('request');
        /** @var \Magento\Catalog\Model\Category $page */
        $category = $observer->getData('category');

        $data = $request->getPostValue();

        if (isset($data['components']) && !empty($data['components'])) {
            $category->setContentConstructorContent($data['components']);
        }
    }
}
