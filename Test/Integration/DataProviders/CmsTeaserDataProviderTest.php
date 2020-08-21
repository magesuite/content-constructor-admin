<?php

namespace MageSuite\ContentConstructorAdmin\Test\Integration\DataProviders;

class CmsTeaserDataProviderTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\TestFramework\ObjectManager
     */
    private $objectManager;

    /**
     * @var \MageSuite\ContentConstructorAdmin\DataProviders\CmsTeaserAdminDataProvider
     */
    private $dataProvider;

    public function setUp(): void {
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();

        $this->dataProvider = $this->objectManager
            ->get(\MageSuite\ContentConstructorAdmin\DataProviders\CmsTeaserAdminDataProvider::class);
    }

    /**
     * @magentoDbIsolation enabled
     * @magentoDataFixture loadCmsPages
     */
    public function testItReturnsCorrectTagsStructure()
    {
        $result = $this->dataProvider->getTags();

        $this->assertEquals($this->getExpectedData(), $result);
    }

    public static function loadCmsPages() {
        include __DIR__.'/_files/pages.php';
    }

    protected function getExpectedData()
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
