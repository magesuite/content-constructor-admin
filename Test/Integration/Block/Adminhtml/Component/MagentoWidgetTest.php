<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Block\Adminhtml\Component;

use Magento\TestFramework\Fixture\AppArea;

#[AppArea('adminhtml')]
class MagentoWidgetTest extends \PHPUnit\Framework\TestCase
{
    protected ?\Magento\TestFramework\ObjectManager $objectManager;
    protected ?\MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component\MagentoWidget $block;

    public function setUp(): void
    {
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();
        $this->block = $this->objectManager->create(
            \MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component\MagentoWidget::class
        );
    }

    public function testWidgetWindowUrlContainsCorrectRoute(): void
    {
        $url = $this->block->getWidgetWindowUrl();

        $this->assertStringContainsString('widget/index', $url);
    }

    public function testWidgetWindowUrlIsNonEmpty(): void
    {
        $this->assertNotEmpty($this->block->getWidgetWindowUrl());
    }
}
