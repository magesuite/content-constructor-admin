<?php

namespace MageSuite\ContentConstructorAdmin\Test\Unit\Service\Upgrade;

class LayoutUpdateCleanerTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \MageSuite\ContentConstructorAdmin\Service\Upgrade\LayoutUpdateCleaner
     */
    protected $cleaner;

    protected $existingXmlWithComponents = <<<XML
        <referenceContainer name="sidebar">
              <block class="Something" name="some_value">
                   <arguments>
                        <argument name="random" xsi:type="string">string</argument>
                   </arguments>
              </block>
        </referenceContainer>
        <referenceContainer name="content">
           <referenceBlock name="page.main.title" remove="true"/>
              <block class="MageSuite\ContentConstructorFrontend\Block\Component" name="first_random_generated_value">
              </block>
              <block class="ClientCustomClass" name="client_custom_class">
                <arguments>
                    <argument name="block_id" xsi:type="string">identifier</argument>
                </arguments>
              </block>
              <block class="MageSuite\ContentConstructorFrontend\Block\Component" name="second_random_generated_value">
              </block>
              <block class="Creativestyle\ContentConstructorFrontendExtension\Block\Component" name="old_naming_component">
              </block>
        </referenceContainer>
XML;


    public function setUp() {
        $this->cleaner = new \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper;
    }
    public function testItRemovesAllComponentClasses() {
        $resultXml = $this->cleaner->cleanXml($this->existingXmlWithComponents);

        $resultXml = '<?xml version="1.0"?><xml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' . $resultXml . '</xml>';
        $resultXml = simplexml_load_string($resultXml);

        $this->assertCount(0, $resultXml->xpath('//block[@class="MageSuite\ContentConstructorFrontend\Block\Component"]'));
        $this->assertCount(0, $resultXml->xpath('//block[@class="Creativestyle\ContentConstructorFrontendExtension\Block\Component"]'));
        $this->assertCount(1, $resultXml->xpath('//block[@class="ClientCustomClass"]'));
        $this->assertCount(1, $resultXml->xpath('//block[@class="Something"]'));
    }
}
