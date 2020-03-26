<?php

namespace MageSuite\ContentConstructorAdmin\Model\ConfigurationProvider;

class CmsPage implements \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\ConfigurationProvider
{
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
        /** @var \Magento\Cms\Model\Page $page */
        $page = $this->registry->registry('cms_page');

        $configuration = json_encode([]);

        if ($page !== null && !empty($page->getContentConstructorContent())) {
            $configuration = $page->getContentConstructorContent();
        }

        return $configuration;
    }

    public function getPageType()
    {
        return 'cms_page_form.cms_page_form';
    }
}
