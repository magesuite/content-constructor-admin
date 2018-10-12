<?php

namespace MageSuite\ContentConstructorAdmin\Test\Unit\Service;

class AdminComponentFactoryTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\TestFramework\ObjectManager
     */
    private $objectManager;

    /**
     * @var \MageSuite\ContentConstructor\Factory\ComponentFactory|\PHPUnit_Framework_MockObject_MockObject
     */
    private $factory;

    public function setUp() {
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();

        $this->factory = $this->objectManager->get(\MageSuite\ContentConstructorAdmin\Service\AdminComponentFactory::class);
    }

    public function testItImplementsComponentFactoryInterface() {
        $this->assertInstanceOf(\MageSuite\ContentConstructor\Factory\AdminComponentFactory::class, $this->factory);
    }

    public function testItReturnsNullWhenComponentDoesNotExists() {
        $createdComponent = $this->factory->create('not_existing_component');

        $this->assertNull($createdComponent);
    }
    /**
     * @dataProvider getComponents
     */
    public function testItReturnsComponentsProperly($componentName, $expectedClass) {
        $createdComponent = $this->factory->create($componentName);

        $this->assertInstanceOf($expectedClass, $createdComponent);
    }

    public function getComponents() {
        return [
            ['headline', \MageSuite\ContentConstructor\Components\Headline\HeadlineAdmin::class],
            ['static-cms-block', \MageSuite\ContentConstructor\Components\StaticBlock\StaticBlockAdmin::class],
            ['picker', \MageSuite\ContentConstructor\Components\Picker\PickerAdmin::class],
            ['image-teaser', \MageSuite\ContentConstructor\Components\ImageTeaser\ImageTeaserAdmin::class],
            ['product-carousel', \MageSuite\ContentConstructor\Components\ProductCarousel\ProductCarouselAdmin::class],
            ['paragraph', \MageSuite\ContentConstructor\Components\Paragraph\ParagraphAdmin::class],
            ['hero-carousel', \MageSuite\ContentConstructor\Components\HeroCarousel\HeroCarouselAdmin::class],
            ['button', \MageSuite\ContentConstructor\Components\Button\ButtonAdmin::class],
            ['category-links', \MageSuite\ContentConstructor\Components\CategoryLinks\CategoryLinksAdmin::class],
            ['product-grid', \MageSuite\ContentConstructor\Components\ProductGrid\ProductGridAdmin::class],
            ['custom-html', \MageSuite\ContentConstructor\Components\CustomHtml\CustomHtmlAdmin::class],
            ['cms-teaser', \MageSuite\ContentConstructor\Components\CmsTeaser\CmsTeaserAdmin::class],
            ['product-finder', \MageSuite\ContentConstructor\Components\ProductFinder\ProductFinderAdmin::class],
            ['daily-deal-teaser', \MageSuite\ContentConstructor\Components\DailyDealTeaser\DailyDealTeaserAdmin::class]
        ];
    }
}