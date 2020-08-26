<?php

namespace MageSuite\ContentConstructorAdmin\Test\Unit\UiComponents;

class CategoryPickerProviderTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\TestFramework\ObjectManager
     */
    private $objectManager;

    /**
     * @var \MageSuite\ContentConstructorAdmin\UiComponents\CategoryPickerProvider
     */
    private $pickerProvider;

    /**
     * @var \MageSuite\ContentConstructorAdmin\Service\UiComponentRenderer|\PHPUnit_Framework_MockObject_MockObject
     */
    private $uiComponentRendererMock;

    public function setUp(): void
    {
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();

        $this->uiComponentRendererMock = $this
            ->getMockBuilder(\MageSuite\ContentConstructorAdmin\Service\UiComponentRenderer::class)
            ->disableOriginalConstructor()
            ->getMock();

        $this->pickerProvider = $this
            ->objectManager
            ->create(
                \MageSuite\ContentConstructorAdmin\UiComponents\CategoryPickerProvider::class,
                ['uiComponentRenderer' => $this->uiComponentRendererMock]
            );
    }

    public function testItImplementsCategoryPickerProviderInterface()
    {
        $this->assertInstanceOf(
            \MageSuite\ContentConstructor\Components\ProductCarousel\CategoryPickerProvider::class,
            $this->pickerProvider
        );
    }

    public function testItRendersUiComponent()
    {
        $this->uiComponentRendererMock
            ->expects($this->once())
            ->method('renderUiComponent')
            ->with('categories_picker')
            ->willReturn('rendered_ui_component');

        $assertContains = method_exists($this, 'assertStringContainsString') ? 'assertStringContainsString' : 'assertContains';

        $this->$assertContains('rendered_ui_component', $this->pickerProvider->renderPicker());
    }
}
