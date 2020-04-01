<?php

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Upgrade;

class PagesMigrationTest extends \MageSuite\ContentConstructorAdmin\Test\Integration\Upgrade\AbstractMigrationTestCase
{
    /**
     * @var \Magento\Cms\Model\PageRepository
     */
    protected $pageRepository;

    public function setUp()
    {
        parent::setUp();
        $this->pageRepository = $this->objectManager->get(\Magento\Cms\Model\PageRepository::class);
    }

    /**
     * @magentoDbIsolation enabled
     * @magentoAppIsolation enabled
     *
     * @magentoDataFixture loadPagesFixture
     * @magentoDataFixture loadWebsiteAndStoresFixture
     * @dataProvider storesAndPagesData
     */
    public function testPagesMigrationOnUpgrade($storeCode, $pageId)
    {
        $storeId = $this->storeRepository->get($storeCode)->getId();
        $layoutUpdate = $this->getXmlInputStringForStoreId($storeId);

        $page = $this->pageRepository->getById($pageId);
        $page->setStoreId($storeId);
        $page->setLayoutUpdateXml($layoutUpdate);
        $page->save();

        $this->migration->transferOldXmlValuesToNewJsonFields();

        $page = $this->pageRepository->getById($pageId);
        $content = $page->getContentConstructorContent();
        $this->assertJson($content);
        $this->assertNoComponentsInXml($page->getLayoutUpdateXml());
        $this->assertEquals($layoutUpdate, $page->getLayoutUpdateXmlBackup());
        $this->assertEquals($this->getExpectedJson($storeId), $content);
    }

    public static function storesAndPagesData()
    {
        return
        [
            [self::ALL_STORE_VIEWS, 101],
            ["store_for_eu_website", 102],
            ["store_for_us_website", 103]
        ];
    }

    public static function loadPagesFixture()
    {
        include __DIR__ . "/../../../../magesuite-frontend/Test/Integration/_files/pages.php";
    }

    public static function loadPagesFixtureRollback()
    {
        include __DIR__ . "/../../../../magesuite-frontend/Test/Integration/_files/pages_rollback.php";
    }
}
