<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Plugin\Cms\Model\Block;

class AddContentConstructorOnBlockSaveTest extends \Magento\TestFramework\TestCase\AbstractBackendController
{
    protected ?\Magento\TestFramework\ObjectManager $objectManager;
    protected ?\Magento\Cms\Api\BlockRepositoryInterface $blockRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();
        $this->blockRepository = $this->objectManager->get(\Magento\Cms\Api\BlockRepositoryInterface::class);
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

        $this->dispatch('backend/cms/block/save/');

        $block = $this->blockRepository->getById($identifier);

        $assertContains = method_exists($this, 'assertStringContainsString') ? 'assertStringContainsString' : 'assertContains';

        if ($expected === null) {
            $this->assertNull($block->getContentConstructorContent());
        } else {
            $this->$assertContains($expected, $block->getContentConstructorContent());
        }
    }

    public static function dataProvider(): array
    {
        return [
            ['Block without components', null, 'block-without-components', null],
            ['Block with empty components', '[]', 'block-with-empty-components', '[]'],
            [
                'Block with components',
                '[{"type":"headline","id":"component2f8c","section":"content","data":{"title":"test","subtitle":"test","componentVisibility":{"mobile":true,"desktop":true}}}]',
                'block-with-components',
                '[{"type":"headline","id":"component2f8c","section":"content","data":{"title":"test","subtitle":"test","componentVisibility":{"mobile":true,"desktop":true}}}]'
            ]
        ];
    }
}
