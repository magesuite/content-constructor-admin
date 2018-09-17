<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\Page\Edit;

use Magento\Framework\Url;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface;

class CreativeComponentsListButton implements ButtonProviderInterface
{
    /**
     * @var Url
     */
    protected $urlHelper;

    /**
     * @param Url $urlHelper
     */
    public function __construct(Url $urlHelper) {
        $this->urlHelper = $urlHelper;
    }

    /**
     * @return array
     */
    public function getButtonData()
    {
        $url = $this->urlHelper->getUrl('contentconstructor/components/index', ['_nosid' => true]);

        $data = [
            'label' => __('Components List'),
            'class' => '',
            'on_click' => "window.open('" . $url . "','_blank');",
            'sort_order' => 20,
        ];

        return $data;
    }
}
