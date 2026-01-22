<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Observer;

class PageEditObserverTest extends \Magento\TestFramework\TestCase\AbstractBackendController
{
    protected ?\Magento\TestFramework\ObjectManager $objectManager;
    protected ?\Magento\Cms\Api\PageRepositoryInterface $pageRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();
        $this->pageRepository = $this->objectManager->get(\Magento\Cms\Api\PageRepositoryInterface::class);
    }

    /**
     * @magentoAppIsolation enabled
     * @magentoDbIsolation enabled
     * @magentoAppArea adminhtml
     * @dataProvider dataProvider
     */
    public function testItReturnsCorrectData(string $title, ?string $components, string $identifier, ?string $expected): void
    {
        $this->getRequest()->setMethod(\Magento\Framework\App\Request\Http::METHOD_POST);
        $this->getRequest()->setPostValue([
            'title' => $title,
            'components' => $components,
            'identifier' => $identifier
        ]);

        $this->dispatch('backend/cms/page/save/');

        $page = $this->pageRepository->getById($identifier);

        $assertContains = method_exists($this, 'assertStringContainsString') ? 'assertStringContainsString' : 'assertContains';

        if ($expected === null) {
            $this->assertNull($page->getContentConstructorContent());
        } else {
            $this->assertNull($page->getLayoutUpdateXml());
            $this->$assertContains($expected, $page->getContentConstructorContent());
        }
    }

    public static function dataProvider(): array
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
