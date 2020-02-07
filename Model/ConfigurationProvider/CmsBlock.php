<?php

namespace MageSuite\ContentConstructorAdmin\Model\ConfigurationProvider;

class CmsBlock implements \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\ConfigurationProvider
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
        /** @var \Magento\Cms\Model\Block $block */
        $block = $this->registry->registry('cms_block');

        $configuration = [];

        if ($block !== null && !empty($block->getContentConstructorContent())) {
            $configuration = json_decode($block->getContentConstructorContent(), true);
        }

        return json_encode($configuration);
    }

    public function getPageType()
    {
        return 'cms_block_form.cms_block_form';
    }
}
