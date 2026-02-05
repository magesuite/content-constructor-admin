<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Upgrade;

class PagesMigrationTest extends \MageSuite\ContentConstructorAdmin\Test\Integration\Upgrade\AbstractMigrationTestCase
{
    protected ?\Magento\Cms\Model\PageRepository $pageRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->pageRepository = $this->objectManager->get(\Magento\Cms\Model\PageRepository::class);
    }

    /**
     * @magentoDbIsolation enabled
     * @magentoAppIsolation enabled
     * @magentoDataFixture MageSuite_Frontend::Test/Integration/_files/pages.php
     * @magentoDataFixture Magento_InventorySalesApi::Test/_files/websites_with_stores.php
     * @dataProvider storesAndPagesData
     */
    public function testPagesMigrationOnUpgrade(mixed $storeCode, int $pageId): void
    {
        $storeId = (int)$this->storeRepository->get($storeCode)->getId();
        $layoutUpdate = $this->getXmlInputStringForStoreId($storeId);

        $page = $this->pageRepository->getById($pageId);
        $page->setStoreId($storeId);
        $page->setLayoutUpdateXml($layoutUpdate);
        $page->setLayoutUpdateXmlBackup('');
        $page->setContentConstructorContent('');
        $page->save();

        $this->migration->transferOldXmlValuesToNewJsonFields();

        $page = $this->pageRepository->getById($pageId);
        $content = $page->getContentConstructorContent();
        $this->assertJson($content);
        $this->assertNoComponentsInXml($page->getLayoutUpdateXml());
        $this->assertEquals($layoutUpdate, $page->getLayoutUpdateXmlBackup());
        $this->assertEquals($this->getExpectedJson($storeId), $content);
    }

    public static function storesAndPagesData(): array
    {
        return
        [
            [self::ALL_STORE_VIEWS, 101],
            ["store_for_eu_website", 102],
            ["store_for_us_website", 103]
        ];
    }
}
