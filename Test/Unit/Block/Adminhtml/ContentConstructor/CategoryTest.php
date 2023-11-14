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
    protected $xmlToComponentMapperStub;

    public function setUp()
    {
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();

        $this->xmlToComponentMapperStub = $this->getMockBuilder(\MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper::class)->getMock();
        $this->registryStub = $this->getMockBuilder(\Magento\Framework\Registry::class)->getMock();

        /** @var \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\Category $block */
        $this->block = $this->objectManager->create(
            \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\Category::class,
            [
                'xmlToComponentConfiguration' => $this->xmlToComponentMapperStub,
                'registry' => $this->registryStub
            ]
        );
    }

    public function testItReturnsCorrectJsonRepresentationOfConfiguration()
    {
        $categoryStub = $this->objectManager->get(\Magento\Catalog\Model\Category::class);

        $categoryStub->setCustomLayoutUpdate('layout_xml');

        $this->registryStub->method('registry')->with('current_category')->willReturn($categoryStub);

        $this->xmlToComponentMapperStub->method('map')->with('layout_xml')->willReturn([['type' => 'headline', 'id' => '1']]);

        $this->assertEquals(
            '[{"type":"headline","id":"1"}]',
            $this->block->getExistingComponentsConfiguration()
        );
    }

    public function testItReturnsCorrectPageType() {
        $this->assertEquals('category_form.category_form', $this->block->getPageType());
    }

    public function testItReturnsCorrectProductsPerPageValue() {
        $this->assertEquals(9, $this->block->getProductsPerPage());
    }
}
