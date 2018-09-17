<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\Page\Edit;

use Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface;

class PreviewButton implements ButtonProviderInterface
{

    /**
     * @return array
     */
    public function getButtonData()
    {
        $data = [
            'label' => __('Preview'),
            'class' => '',
            'on_click' => "previewContentConstructor(document.querySelector('input[name=\"components\"]').value)",
            'sort_order' => 20,
        ];

        return $data;
    }
}


