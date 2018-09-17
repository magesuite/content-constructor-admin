<?php

namespace MageSuite\ContentConstructorAdmin\Service;

use Magento\Framework\View\Element\UiComponentFactory;
use Magento\Framework\View\Element\BlockFactory;
use Magento\Framework\View\Layout\Generator\Context as GeneratorContext;
use Magento\Framework\View\Element\UiComponent\ContextFactory as UiComponentContextFactory;

/**
 * Class RenderUiComponent
 */
class UiComponentRenderer extends \Magento\Framework\View\Layout\Generator\UiComponent
{
    /**
     * @var GeneratorContext
     */
    protected $generatorContext;
    /**
     * @var \Magento\Framework\View\Result\LayoutFactory
     */
    private $layoutFactory;
    /**
     * @var \Magento\Framework\View\Layout\Generic
     */
    private $layout;

    /**
     * RenderUiComponent constructor.
     * @param UiComponentFactory $uiComponentFactory
     * @param BlockFactory $blockFactory
     * @param UiComponentContextFactory $contextFactory
     * @param GeneratorContext $generatorContext
     */
    public function __construct(
        UiComponentFactory $uiComponentFactory,
        BlockFactory $blockFactory,
        UiComponentContextFactory $contextFactory,
        GeneratorContext $generatorContext,
        \Magento\Framework\View\Layout $layout
    ) {
        $this->generatorContext = $generatorContext;
        $this->layout = $layout;

        parent::__construct($uiComponentFactory, $blockFactory, $contextFactory);
    }

    /**
     * @param $name
     * @return string
     */
    public function renderUiComponent($name)
    {
        $structure = $this->generatorContext->getStructure();
        $layout = $this->layout;
        $data = [
            'attributes' => [
                'group' => '',
                'component' => ''
            ]
        ];
        $uicomponent = $this->generateComponent($structure, $name, $data, $layout);
        return $uicomponent->toHtml();
    }
}
