<?php

namespace MageSuite\ContentConstructorAdmin\Test\Unit\Block\Adminhtml\ContentConstructor;

class CmsPageTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\TestFramework\ObjectManager
     */
    protected $objectManager;

    /**
     * @var \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\CmsPage
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

        /** @var \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\CmsPage $block */
        $this->block = $this->objectManager->create(
            \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\CmsPage::class,
            [
                'xmlToComponentConfiguration' => $this->xmlToComponentMapperStub,
                'registry' => $this->registryStub
            ]
        );
    }

    public function testItReturnsCorrectConfiguratorUrl()
    {
        $this->assertEquals(
            'http://localhost/index.php/contentconstructor/component/configurator/type/{/component_type}',
            $this->block->getConfiguratorEndpointUrl()
        );
    }

    public function testItReturnsCorrectRestTokenEndpointUrl()
    {
        $this->assertEquals(
            'http://localhost/index.php/contentconstructor/token/generator/',
            $this->block->getRestTokenEndpoint()
        );
    }

    public function testItReturnsCorrectImageEndpointUrl()
    {
        $this->assertEquals(
            'http://localhost/index.php/contentconstructor/image/show/image/{/encoded_image}',
            $this->block->getImageEndpoint()
        );
    }

    public function testItReturnsCorrectCategoryDataProviderEntpointUrl() {
        $this->assertEquals(
            'http://localhost/index.php/contentconstructor/category/provider/',
            $this->block->getCategoryDataProviderEndpoint()
        );
    }

    public function testItReturnsCorrectUploaderUrl()
    {
       $url = $this->block->getUploaderUrl();

       $this->assertContains('http://localhost/index.php/backend/cms/wysiwyg_images/index/key/', $url);
    }

    public function testItReturnsCorrectAdminPrefix()
    {
        $url = $this->block->getAdminPrefix();

        $this->assertContains('backend', $url);
    }

    public function testItReturnsCorrectJsonRepresentationOfConfiguration()
    {
        $pageStub = $this->objectManager->get(\Magento\Cms\Model\Page::class);

        $pageStub->setLayoutUpdateXml('layout_xml');

        $this->registryStub->method('registry')->with('cms_page')->willReturn($pageStub);

        $this->xmlToComponentMapperStub->method('map')->with('layout_xml')->willReturn([['type' => 'headline', 'id' => '1']]);

        $this->assertEquals(
            '[{"type":"headline","id":"1"}]',
            $this->block->getExistingComponentsConfiguration()
        );
    }

    public function testItReturnsCorrectPageType() {
        $this->assertEquals('cms_page_form.cms_page_form', $this->block->getPageType());
    }
}