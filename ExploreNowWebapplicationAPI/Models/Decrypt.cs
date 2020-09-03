using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace ExploreNowWebapplicationAPI.Models
{
    public class Decrypt
    {
        // Källa: https://foxlearn.com/windows-forms/encryption-and-decryption-using-rot13-in-csharp-375.html
        public string ROT13(string input)
        {
            StringBuilder result = new StringBuilder();
            Regex regex = new Regex("[A-Za-z]"); // Fungerar ej med Å,Ä,Ö
            foreach (char c in input)
            {
                if (regex.IsMatch(c.ToString()))
                {
                    int code = ((c & 223) - 52) % 26 + (c & 32) + 65;
                    result.Append((char)code);
                }
                else
                    result.Append(c);
            }
            return result.ToString();
        }
    }
}