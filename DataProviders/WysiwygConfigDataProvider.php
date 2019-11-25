<?php

namespace MageSuite\ContentConstructorAdmin\DataProviders;

class WysiwygConfigDataProvider implements \MageSuite\ContentConstructor\Components\Paragraph\WysiwygConfigDataProvider
{
    /**
     * @var \Magento\Cms\Model\Wysiwyg\Config
     */
    private $wysiwygConfig;

    public function __construct(\Magento\Cms\Model\Wysiwyg\Config $wysiwygConfig)
    {
        $this->wysiwygConfig = $wysiwygConfig;
    }

    public function getConfig()
    {
        return $this->wysiwygConfig->getConfig();
    }
}
