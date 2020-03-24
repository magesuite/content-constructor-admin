<?php

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Upgrade;

abstract class AbstractMigrationTestCase extends \PHPUnit\Framework\TestCase
{
    const ALL_STORE_VIEWS = 0;

    /**
     * @var \Magento\Framework\App\ObjectManager
     */
    protected $objectManager;

    /**
     * @var \Magento\Store\Model\StoreRepository
     */
    protected $storeRepository;

    /**
     * @var \Magento\Store\Model\StoreManager
     */
    protected $storeManager;

    /**
     * @var \MageSuite\ContentConstructorAdmin\Service\Upgrade\Migration
     */
    protected $migration;

    public function setUp()
    {
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();
        $this->storeRepository = $this->objectManager->get(\Magento\Store\Model\StoreRepository::class);
        $this->storeManager = $this->objectManager->get(\Magento\Store\Model\StoreManager::class);
        $this->migration = $this->objectManager->get(\MageSuite\ContentConstructorAdmin\Service\Upgrade\Migration::class);
    }

    protected function runAssertions(array $input, $repository, $idOffset = 0)
    {
        foreach ($input as $storeId => $items) {
            for ($i = 1 + $idOffset; $i <= 3 + $idOffset; $i++) {
                $item = $this->getItemFromRepository($repository, $i, $storeId);
                $content = $item->getContentConstructorContent();

                $this->assertNoComponentsInXml($item->getCustomLayoutUpdate());

                if (in_array($i, $items)) {
                    $this->assertJson($content);
                    $this->assertEquals($this->getExpectedJson($storeId), $content);
                    $this->assertEquals($this->getXmlInputStringForStoreId($storeId), $item->getLayoutUpdateXmlBackup());
                } elseif (in_array($i, $input[0])) {
                    $this->assertJson($content);
                    $this->assertEquals($this->getExpectedJson(self::ALL_STORE_VIEWS), $content);
                    $this->assertEquals($this->getXmlInputStringForStoreId(self::ALL_STORE_VIEWS), $item->getLayoutUpdateXmlBackup());
                } else {
                    $this->assertNull($content);
                }
            }
        }
    }

    protected function assertNoComponentsInXml($xml) {
        $xml = '<?xml version="1.0"?><xml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' . $xml . '</xml>';
        $xml = simplexml_load_string($xml);

        $this->assertCount(0, $xml->xpath('//block[@class="MageSuite\ContentConstructorFrontend\Block\Component"]'));
        $this->assertCount(0, $xml->xpath('//block[@class="Creativestyle\ContentConstructorFrontendExtension\Block\Component"]'));
    }

    protected function getXmlInputStringForStoreId($storeId)
    {
        return <<<XML
<referenceContainer name="cc-content">
    <block class="MageSuite\ContentConstructorFrontend\Block\Component" name="componentebe5">
        <arguments>
            <argument xsi:type="string" name="type">button</argument>
            <argument xsi:type="string" name="name">button_store_{$storeId}</argument>
            <argument xsi:type="string" name="section">cc-content</argument>
            <argument xsi:type="array" name="data">
                <item name="label" xsi:type="string">Button</item>
                <item name="target" xsi:type="string"></item>
                <item name="componentVisibility" xsi:type="array">
                <item name="mobile" xsi:type="string">1</item>
                <item name="desktop" xsi:type="string">1</item>
                </item>
            </argument>
        </arguments>
    </block>
</referenceContainer>
XML;
    }

    protected function getExpectedJson($storeId)
    {
        $expected = [
            0 => [
                'id' => 'componentebe5',
                'section' => 'cc-content',
                'type' => 'button',
                'name' => "button_store_{$storeId}",
                'data' => [
                    'label' => 'Button',
                    'target' => '',
                    'componentVisibility' =>  [
                        'mobile' => '1',
                        'desktop' => '1',
                    ],
                ],
            ],
        ];

        return json_encode($expected);
    }

    public static function loadWebsiteAndStoresFixture()
    {
        include __DIR__ . "/../../../../../magento/module-inventory-sales-api/Test/_files/websites_with_stores.php";
    }

    public static function loadReindexInventoryFixtureRollback()
    {
        include __DIR__ . "/../../../../../magento/module-inventory-sales-api/Test/_files/websites_with_stores_rollback.php";
    }
}
