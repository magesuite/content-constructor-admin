<?php

namespace MageSuite\ContentConstructorAdmin\Test\Unit\Block\Adminhtml\ContentConstructor;

class CategoryTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\TestFramework\ObjectManager
     */
    protected $objectManager;

    /**
     * @var \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\Category
     */
    protected $block;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $registryStub;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $configurationProvider;

    public function setUp(): void
    {
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();

        $this->configurationProvider = $this->getMockBuilder(\MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\ConfigurationProvider::class)->getMock();
        $this->registryStub = $this->getMockBuilder(\Magento\Framework\Registry::class)->getMock();

        /** @var \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\Category $block */
        $this->block = $this->objectManager->create(
            \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\Category::class,
            [
                'configurationProvider' => $this->configurationProvider,
                'registry' => $this->registryStub
            ]
        );
    }

    public function testItReturnsCorrectJsonRepresentationOfConfiguration()
    {
        $this->configurationProvider->method('getExistingComponentsConfiguration')->willReturn(json_encode([['type' => 'headline', 'id' => '1']]));

        $this->assertEquals(
            '[{"type":"headline","id":"1"}]',
            $this->block->getExistingComponentsConfiguration()
        );
    }

    public function testItReturnsCorrectPageType() {
        $this->configurationProvider->method('getPageType')->willReturn('category_form.category_form');

        $this->assertEquals('category_form.category_form', $this->block->getPageType());
    }
}
