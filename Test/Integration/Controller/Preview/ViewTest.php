<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Controller\Preview;

class ViewTest extends \Magento\TestFramework\TestCase\AbstractController
{
    protected ?\MageSuite\ContentConstructorAdmin\Service\PreviewSecretProvider $previewSecretProvider;

    protected function setUp(): void
    {
        parent::setUp();

        $this->previewSecretProvider = $this->_objectManager->get(\MageSuite\ContentConstructorAdmin\Service\PreviewSecretProvider::class);
    }

    /**
     * @dataProvider dataProvider
     */
    public function testIfPreviewActionReturnsProperContent(string $expectedText): void
    {
        $this->dispatchPreviewRequest($expectedText);
        $html = $this->getResponse()->getBody();
        $this->assertStringContainsString($expectedText, $html);
    }
    protected function dispatchPreviewRequest(string $text): void
    {
        $configuration = [
            [
                "name" => "Headline",
                "type" => "headline",
                "id" => "dummy_component",
                "section" => "content",
                "data" => [
                    "customCssClass" => '',
                    "title" => $text,
                    "subtitle" => '',
                    "headingTag" => "h2",
                    "cc_css_classes" => '',
                    "componentVisibility" => [
                        "mobile" => true,
                        "desktop" => true
                    ]
                ]
            ]
        ];

        $configuration = json_encode($configuration);
        $this->getRequest()->setMethod(\Magento\Framework\App\Request\Http::METHOD_POST);
        $this->getRequest()->setPostValue('secret_preview_token', $this->previewSecretProvider->execute($configuration));
        $this->getRequest()->setPostValue('configuration', $configuration);
        $this->dispatch('content-constructor/preview/view');
    }

    public static function dataProvider(): array
    {
        return [
            ['First Dummy Text'],
            ['Second Dummy Text']
        ];
    }

}
