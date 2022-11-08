<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Controller\Adminhtml\ContentConstructor\UseDefault;

class BrandsTest extends AbstractUseDefault
{
    protected ?\MageSuite\BrandManagement\Model\BrandsRepository $brandsRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->brandsRepository = $this->objectManager->create(\MageSuite\BrandManagement\Model\BrandsRepository::class);
    }

    /**
     * @magentoDataFixtureBeforeTransaction MageSuite_ContentConstructorAdmin::Test/Integration/_files/brand_with_content_constructor_headline.php
     */
    public function testRemoveStoreData(): void
    {
        $brand = $this->brandsRepository->getById(600, 1);

        $this->assertTrue(
            str_contains($brand->getLayoutUpdateXml(), 'headline2'),
            'Fixture value not asserted'
        );

        $this->request->setPostValue('use_default_components', 1);
        $this->request->setPostValue('store_id', 1);
        $this->brandsRepository->save($brand);
        $brand = $this->brandsRepository->getById(600, 1);

        $this->assertFalse(
            str_contains($brand->getLayoutUpdateXml(), 'headline2'),
            'The old value asserted but should be removed'
        );
        $this->assertTrue(
            str_contains($brand->getLayoutUpdateXml(), 'headline'),
            'The new value not asserted'
        );
    }
}
