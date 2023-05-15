<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component;

class CmsPagesTeaser extends \Magento\Framework\View\Element\Template
{
    protected $_template = 'components/configurators/cms_pages_teaser.phtml';

    /**
     * @var \MageSuite\ContentConstructorAdmin\DataProviders\CmsTeaserAdminDataProvider
     */
    protected $tagsProvider;

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \MageSuite\ContentConstructorAdmin\DataProviders\CmsTeaserAdminDataProvider $tagsProvider,
        array $data = []
    )
    {
        parent::__construct($context, $data);

        $this->tagsProvider = $tagsProvider;
    }

    public function getTags() {
        return $this->tagsProvider->getTags();
    }
}
