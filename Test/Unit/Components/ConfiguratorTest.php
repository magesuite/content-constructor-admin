<?php

namespace MageSuite\ContentConstructorAdmin\Test\Unit\Components;

class ConfiguratorTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\TestFramework\ObjectManager
     */
    private $objectManager;

    public function setUp() {
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();
    }

    /**
     * @dataProvider getComponentsWithExpectedMarkup
     */
    public function testItDisplaysConfiguratorTemplate($componentClass, $expectedMarkup) {
        $adminComponent = $this->objectManager->get($componentClass);

        $configuratorMarkup = $adminComponent->renderConfigurator();

        if(is_array($expectedMarkup)) {
            foreach($expectedMarkup as $expectedFragment) {
                $this->assertContains($expectedFragment, $configuratorMarkup);
            }
        } else {
            $this->assertContains($expectedMarkup, $configuratorMarkup);
        }
    }

    public static function getComponentsWithExpectedMarkup() {
        return [
            [
                \MageSuite\ContentConstructor\Components\Headline\HeadlineAdmin::class,
                '<headline-configurator'
            ],
            [
                \MageSuite\ContentConstructor\Components\Picker\PickerAdmin::class,
                '<component-picker'
            ]
        ];
    }
}