<?php

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Observer;

class PageEditObserverTest extends \Magento\TestFramework\TestCase\AbstractBackendController
{
    /**
     * @var \Magento\TestFramework\ObjectManager
     */
    protected $objectManager;

    /**
     * @var \Magento\Cms\Api\PageRepositoryInterface
     */
    protected $pageRepository;

    public function setUp()
    {
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();
        $this->pageRepository = $this->objectManager->get(\Magento\Cms\Api\PageRepositoryInterface::class);

        parent::setUp();
    }

    /**
     * @magentoAppIsolation enabled
     * @magentoDbIsolation enabled
     * @magentoAppArea adminhtml
     * @param string $title
     * @param string $components
     * @param string $identifier
     * @param string $expected
     * @dataProvider dataProvider
     */
    public function testItReturnsCorrectData($title, $components, $identifier, $expected)
    {
        $this->getRequest()->setMethod(\Magento\Framework\App\Request\Http::METHOD_POST);
        $this->getRequest()->setPostValue([
            'title' => $title,
            'components' => $components,
            'identifier' => $identifier
        ]);

        $this->dispatch('backend/cms/page/save/');

        $page = $this->pageRepository->getById($identifier);

        if($expected === null){
            $this->assertNull($page->getContentConstructorContent());
        }else{
            $this->assertNull($page->getLayoutUpdateXml());
            $this->assertContains($expected, $page->getContentConstructorContent());
        }
    }

    public function dataProvider()
    {
        return [
            ['Page without components', null, 'page-without-components', null],
            ['Page with empty components', '[]', 'page-with-empty-components', null],
            [
                'Page with components',
                '[{"type":"headline","id":"component2f8c","section":"content","data":{"title":"test","subtitle":"test","componentVisibility":{"mobile":true,"desktop":true}}}]',
                'page-with-components',
                '[{"type":"headline","id":"component2f8c","section":"content","data":{"title":"test","subtitle":"test","componentVisibility":{"mobile":true,"desktop":true}}}]'
            ]
        ];
    }
}
