<?php

namespace MageSuite\ContentConstructorAdmin\Service;

class AdminComponentFactory implements \MageSuite\ContentConstructor\Factory\AdminComponentFactory
{
    /**
     * @var \Magento\Framework\ObjectManagerInterface
     */
    private $objectManager;

    public function __construct(\Magento\Framework\ObjectManagerInterface $objectManager)
    {
        $this->objectManager = $objectManager;
    }

    private $classMappings = [
        'headline' => \MageSuite\ContentConstructor\Components\Headline\HeadlineAdmin::class,
        'static-cms-block' => \MageSuite\ContentConstructor\Components\StaticBlock\StaticBlockAdmin::class,
        'picker' => \MageSuite\ContentConstructor\Components\Picker\PickerAdmin::class,
        'image-teaser' => \MageSuite\ContentConstructor\Components\ImageTeaser\ImageTeaserAdmin::class,
        'product-carousel' => \MageSuite\ContentConstructor\Components\ProductCarousel\ProductCarouselAdmin::class,
        'paragraph' => \MageSuite\ContentConstructor\Components\Paragraph\ParagraphAdmin::class,
        'hero-carousel' => \MageSuite\ContentConstructor\Components\HeroCarousel\HeroCarouselAdmin::class,
        'button' => \MageSuite\ContentConstructor\Components\Button\ButtonAdmin::class,
        'category-links' => \MageSuite\ContentConstructor\Components\CategoryLinks\CategoryLinksAdmin::class,
        'product-grid' => \MageSuite\ContentConstructor\Components\ProductGrid\ProductGridAdmin::class,
        'magento-product-grid-teasers' => \MageSuite\ContentConstructor\Components\MagentoProductGridTeasers\MagentoProductGridTeasersAdmin::class,
        'custom-html' => \MageSuite\ContentConstructor\Components\CustomHtml\CustomHtmlAdmin::class,
        'cms-teaser' => \MageSuite\ContentConstructor\Components\CmsTeaser\CmsTeaserAdmin::class,
        'product-finder' => \MageSuite\ContentConstructor\Components\ProductFinder\ProductFinderAdmin::class,
        'daily-deal-teaser' => \MageSuite\ContentConstructor\Components\DailyDealTeaser\DailyDealTeaserAdmin::class
    ];

    /**
     * @param $componentName
     * @return \MageSuite\ContentConstructor\AdminComponent
     */
    public function create(string $componentName)
    {
        if(!isset($this->classMappings[$componentName])) {
            return null;
        }

        return $this->objectManager->get($this->classMappings[$componentName]);
    }
}
