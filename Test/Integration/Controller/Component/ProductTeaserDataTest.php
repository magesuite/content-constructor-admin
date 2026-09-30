<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Controller\Component;

#[\Magento\TestFramework\Fixture\AppArea('frontend')]
class ProductTeaserDataTest extends \Magento\TestFramework\TestCase\AbstractController
{
    #[\Magento\TestFramework\Fixture\DataFixture('Magento/Catalog/_files/product_simple.php')]
    #[\Magento\TestFramework\Fixture\AppIsolation(true)]
    #[\Magento\TestFramework\Fixture\DbIsolation(true)]
    public function testStorefrontRequestCannotReadProductTeaserData(): void
    {
        $this->dispatch('/content-constructor/component/productteaserdata?sku=simple');

        $this->assert404NotFound();
        $this->assertStringNotContainsString('Short description', (string) $this->getResponse()->getBody());
    }
}
