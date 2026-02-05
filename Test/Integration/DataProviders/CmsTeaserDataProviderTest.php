<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\DataProviders;

class CmsTeaserDataProviderTest extends \PHPUnit\Framework\TestCase
{
    protected ?\MageSuite\ContentConstructorAdmin\DataProviders\CmsTeaserAdminDataProvider $dataProvider;

    protected function setUp(): void {
        $objectManager = \Magento\TestFramework\ObjectManager::getInstance();
        $this->dataProvider = $objectManager
            ->get(\MageSuite\ContentConstructorAdmin\DataProviders\CmsTeaserAdminDataProvider::class);
    }

    /**
     * @magentoDbIsolation enabled
     * @magentoDataFixture MageSuite_ContentConstructorAdmin::Test/Integration/DataProviders/_files/pages.php
     */
    public function testItReturnsCorrectTagsStructure(): void
    {
        $result = $this->dataProvider->getTags();

        $this->assertEquals($this->getExpectedData(), $result);
    }

    protected function getExpectedData(): array
    {
        return [
            'optgroup' => [
                [
                    'label' => 'double tag',
                    'value' => 'double tag',
                    'is_active' => '1',
                ],
                [
                    'label' => 'second',
                    'value' => 'second',
                    'is_active' => '1',
                ],
                [
                    'label' => 'test tag',
                    'value' => 'test tag',
                    'is_active' => '1',
                ],
                [
                    'label' => 'third',
                    'value' => 'third',
                    'is_active' => '1',
                ],
            ]
        ];
    }
}
