<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\DataProviders;

class StaticBlockDataProviderTest extends \PHPUnit\Framework\TestCase
{
    protected ?\Magento\TestFramework\ObjectManager $objectManager;
    protected ?\MageSuite\ContentConstructorAdmin\DataProviders\StaticBlockDataProvider $dataProvider;

    public function setUp(): void 
    {
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();
        $this->dataProvider = $this->objectManager
                ->get(\MageSuite\ContentConstructorAdmin\DataProviders\StaticBlockDataProvider::class);
    }

    /**
     * @magentoDbIsolation enabled
     * @magentoDataFixture MageSuite_ContentConstructorAdmin::Test/Integration/DataProviders/_files/remove_all_blocks.php
     * @magentoDataFixture Magento/Cms/_files/block.php
     * @magentoDataFixture MageSuite_ContentConstructorAdmin::Test/Integration/DataProviders/_files/block.php
     */
    public function testItReturnsCorrectData(): void
    {
        $this->assertEquals(
            [
                ['identifier' => 'fixture_block', 'title' => 'CMS Block Title'],
                ['identifier' => 'another_fixture_block', 'title' => 'Another block title']
            ],
            $this->dataProvider->getBlocks()
        );
    }
}
