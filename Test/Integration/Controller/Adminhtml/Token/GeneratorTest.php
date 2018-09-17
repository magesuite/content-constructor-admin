<?php

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Controller\Adminhtml\Token;

class GeneratorTest extends \Magento\TestFramework\TestCase\AbstractBackendController
{
    const TOKEN_GENERATOR_URL = '/backend/content-constructor/token/generator';

    public function testTokenIsGeneratedProperly() {
        $this->dispatch(self::TOKEN_GENERATOR_URL);

        $token = $this->getResponse()->getBody();

        $this->assertEquals(32, strlen($token));
    }


}
