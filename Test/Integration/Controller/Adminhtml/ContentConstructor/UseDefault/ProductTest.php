<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Controller\Adminhtml\ContentConstructor\UseDefault;

class ProductTest extends AbstractUseDefault
{
    protected ?\Magento\Catalog\Api\ProductRepositoryInterface $productRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->productRepository = $this->objectManager->create(\Magento\Catalog\Api\ProductRepositoryInterface::class);
    }

    /**
     * @magentoDataFixtureBeforeTransaction MageSuite_ContentConstructorAdmin::Test/Integration/_files/product_with_content_constructor_headline.php
     */
    public function testRemoveStoreData(): void
    {
        $product = $this->productRepository->get('simple', false, 1, true);
        $contentConstructorValue = $product->getData(\MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME);

        $this->assertTrue(
            strpos($contentConstructorValue, 'headline2') !== false,
            'Fixture value not asserted'
        );

        $this->request->setPostValue('product', ['use_default_components' => 1]);
        $this->productRepository->save($product);

        $product = $this->productRepository->get('simple', false, 1, true);
        $contentConstructorValue = $product->getData(\MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME);

        $this->assertFalse(
            strpos($contentConstructorValue, 'headline2') !== false,
            'The old value asserted but should be removed'
        );
        $this->assertTrue(
            strpos($contentConstructorValue, 'headline') !== false,
            'The new value not asserted'
        );
    }
}
