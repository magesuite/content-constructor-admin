<?php

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Controller\Adminhtml\Token;

class GeneratorTest extends \Magento\TestFramework\TestCase\AbstractBackendController
{
    const TOKEN_GENERATOR_URL = '/backend/content-constructor/token/generator';

    public function testTokenIsGeneratedProperly() {
        $this->dispatch(self::TOKEN_GENERATOR_URL);

        $token = $this->getResponse()->getBody();

        $productMetadata = $this->_objectManager->get(\Magento\Framework\App\ProductMetadataInterface::class);
        $version = $productMetadata->getVersion();

        // From Magento 2.4.4 JWT tokens are introduced that have length of 151 characters
        if(version_compare($version, '2.4.4', '>=')) {
            $this->assertEquals(151, strlen($token));
        } else {
            $this->assertEquals(32, strlen($token));
        }
    }


}
