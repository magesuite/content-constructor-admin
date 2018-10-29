<?php

namespace MageSuite\ContentConstructorAdmin\Test\Integration\DataProviders;

class StaticBlockDataProviderTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\TestFramework\ObjectManager
     */
    private $objectManager;

    /**
     * @var \MageSuite\ContentConstructorAdmin\DataProviders\StaticBlockDataProvider
     */
    private $dataProvider;

    public function setUp() {
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();
        $this->dataProvider = $this->objectManager
                ->get(\MageSuite\ContentConstructorAdmin\DataProviders\StaticBlockDataProvider::class);
    }

    public function testItImplementsCorrectInterface() {
        $this->assertInstanceOf(
            \MageSuite\ContentConstructor\Components\StaticBlock\DataProvider::class,
            $this->dataProvider
        );
    }

    /**
     * @magentoDbIsolation enabled
     * @magentoDataFixture removeAllStaticBlocks
     * @magentoDataFixture Magento/Cms/_files/block.php
     * @magentoDataFixture loadSecondBlockFixture
     */
    public function testItReturnsCorrectData() {
        $this->assertEquals(
            [
                ['identifier' => 'fixture_block', 'title' => 'CMS Block Title'],
                ['identifier' => 'another_fixture_block', 'title' => 'Another block title']
            ],
            $this->dataProvider->getBlocks()
        );
    }

    public static function loadSecondBlockFixture() {
        require __DIR__.'/_files/block.php';
    }

    public static function removeAllStaticBlocks() {
        require __DIR__.'/_files/remove_all_blocks.php';
    }
}