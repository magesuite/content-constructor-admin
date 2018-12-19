<?php

class TemplateLocatorTest extends PHPUnit\Framework\TestCase
{
    public function testItGetsProperLocation()
    {
        $templateLocator = new \MageSuite\ContentConstructorAdmin\Template\Locator();

        $baseDirectory = realpath(__DIR__ . '/../');

        $result = $templateLocator->locate('components/headline/src/headline.twig');

        $expectedResult = $baseDirectory . '/view/adminhtml/templates/components/components/headline/src/headline.twig';

        $this->assertEquals($expectedResult, $result);
    }
}
