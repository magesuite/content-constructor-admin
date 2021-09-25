<?php

namespace MageSuite\ContentConstructorAdmin\UiComponents;

class CategoryPickerProvider
{
    /**
     * @var \MageSuite\ContentConstructorAdmin\Service\UiComponentRenderer
     */
    private $uiComponentRenderer;

    public function __construct(\MageSuite\ContentConstructorAdmin\Service\UiComponentRenderer $uiComponentRenderer)
    {
        $this->uiComponentRenderer = $uiComponentRenderer;
    }

    public function renderPicker()
    {
        return $this->uiComponentRenderer->renderUiComponent('categories_picker');
    }
}
