<?php

namespace MageSuite\ContentConstructorAdmin\Test\Unit\Helper;

class ConfigurationMediaResolverTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\TestFramework\ObjectManager
     */
    protected $objectManager;

    /**
     * @var \MageSuite\ContentConstructorAdmin\Helper\ConfigurationMediaResolver
     */
    protected $configurationMediaResolver;

    public function setUp() {
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();
        $this->configurationMediaResolver = $this->objectManager
            ->get(\MageSuite\ContentConstructorAdmin\Helper\ConfigurationMediaResolver::class);
    }

    public function testItResolvesUrlInNestedConfigurationCorrectly() {
        $configuration = [
            [
                'teasers' => [
                    [
                        'decodedImage' => '{{media url="wysiwyg/dr_1.png"}}',
                        'image' => ''
                    ],
                    [
                        'decoded_image' => '{{media url="wysiwyg/dr_2.png"}}'
                    ],
                    [
                        'decodedImage' => 'some_data'
                    ]
                ]
            ]
        ];

        $result = $this->configurationMediaResolver->resolveMedia($configuration);

        $this->assertEquals('http://localhost/pub/media/wysiwyg/dr_1.png', $result[0]['teasers'][0]['image']);
        $this->assertEquals('http://localhost/pub/media/wysiwyg/dr_2.png', $result[0]['teasers'][1]['image']);

        $this->assertFalse(isset($result[0]['teasers'][2]['image']));
    }
}
