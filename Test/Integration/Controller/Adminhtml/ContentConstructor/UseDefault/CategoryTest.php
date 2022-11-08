<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Controller\Adminhtml\ContentConstructor\UseDefault;

class CategoryTest extends AbstractUseDefault
{
    protected ?\Magento\Catalog\Api\CategoryRepositoryInterface $categoryRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->categoryRepository = $this->objectManager->create(\Magento\Catalog\Api\CategoryRepositoryInterface::class);
    }

    /**
     * @magentoDataFixtureBeforeTransaction MageSuite_ContentConstructorAdmin::Test/Integration/_files/category_with_content_constructor_headline.php
     */
    public function testRemoveStoreData(): void
    {
        $category = $this->categoryRepository->get(333, 1);
        $contentConstructorValue = $category->getData(\MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME);

        $this->assertTrue(
            str_contains($contentConstructorValue, 'headline2'),
            'Fixture value not asserted'
        );

        $this->request->setPostValue('use_default_components', 1);
        $this->categoryRepository->save($category);

        $category = $this->categoryRepository->get(333, 1);
        $contentConstructorValue = $category->getData(\MageSuite\ContentConstructorAdmin\Setup\UpgradeData::CONTENT_CONSTRUCTOR_CONTENT_ATTRIBUTE_NAME);

        $this->assertFalse(
            str_contains($contentConstructorValue, 'headline2'),
            'The old value asserted but should be removed'
        );
        $this->assertTrue(
            str_contains($contentConstructorValue, 'headline'),
            'The new value not asserted'
        );
    }
}
